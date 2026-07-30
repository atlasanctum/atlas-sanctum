package impact_test

import (
	"testing"

	"cosmossdk.io/log"
	"cosmossdk.io/math"
	storetypes "cosmossdk.io/store/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	impactkeeper "github.com/atlashumanitarian/sanctum/x/impact/keeper"
	"github.com/atlashumanitarian/sanctum/x/impact/types"
)

// ─── Mocks ────────────────────────────────────────────────────────────────────

type mockIdentityKeeper struct{ roles map[string]string }

func (m *mockIdentityKeeper) GetUserRole(_ sdk.Context, addr string) (string, bool) {
	r, ok := m.roles[addr]
	return r, ok
}

type mockOracleKeeper struct{ active map[string]bool }

func (m *mockOracleKeeper) IsActiveOracle(_ sdk.Context, addr string) bool {
	return m.active[addr]
}

type mockRewardsKeeper struct{ distributed []string }

func (m *mockRewardsKeeper) DistributeForImpact(_ sdk.Context, r types.ImpactRecord) error {
	m.distributed = append(m.distributed, r.ID)
	return nil
}

// ─── Setup ────────────────────────────────────────────────────────────────────

const (
	provider = "cosmos1qnk2n4nlkpw9xfqntladh74er2xa62wgas3eak"
	oracle1  = "cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh"
	oracle2  = "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl"
	oracle3  = "cosmos1s3nh6tafl4amaxkke9kdejhp09lk93g9ev39r4"
)

func setupImpactKeeper(t *testing.T) (impactkeeper.Keeper, sdk.Context, *mockOracleKeeper, *mockRewardsKeeper) {
	t.Helper()
	key := storetypes.NewKVStoreKey(types.StoreKey)
	ctx := testContext(key)

	ik := &mockIdentityKeeper{roles: map[string]string{provider: "USER"}}
	ok := &mockOracleKeeper{active: map[string]bool{oracle1: true, oracle2: true, oracle3: true}}
	rk := &mockRewardsKeeper{}

	k := impactkeeper.NewKeeper(codec.NewProtoCodec(nil), key, log.NewNopLogger(), ik, ok, rk)
	return k, ctx, ok, rk
}

func testContext(key *storetypes.KVStoreKey) sdk.Context {
	// Minimal in-memory context — same pattern as identity tests.
	return sdk.Context{}
}

// ─── SubmitImpact ─────────────────────────────────────────────────────────────

func TestSubmitImpact_ValidatesType(t *testing.T) {
	msg := &types.MsgSubmitImpact{
		Provider:   provider,
		ImpactType: "INVALID",
		Metric:     "co2_kg",
		Value:      math.LegacyNewDec(100),
	}
	require.ErrorIs(t, msg.ValidateBasic(), types.ErrInvalidImpactType)
}

func TestSubmitImpact_NegativeValueRejected(t *testing.T) {
	msg := &types.MsgSubmitImpact{
		Provider:   provider,
		ImpactType: types.TypeHealth,
		Metric:     "patients",
		Value:      math.LegacyNewDec(-1),
	}
	require.Error(t, msg.ValidateBasic())
}

// ─── VerifyImpact — oracle confirmation threshold ─────────────────────────────

func TestVerifyImpact_ThresholdTriggersVerified(t *testing.T) {
	k, ctx, _, rk := setupImpactKeeper(t)

	record := types.ImpactRecord{
		ID:                "test-impact-001",
		Provider:          provider,
		ImpactType:        types.TypeHealth,
		Metric:            "patients_treated",
		Value:             math.LegacyNewDec(50),
		Status:            types.StatusPending,
		OracleConfirmations: 0,
		ConfirmingOracles: []string{},
	}
	k.SetRecord(ctx, record)

	// First confirmation — still PENDING.
	verified, err := k.VerifyImpact(ctx, oracle1, "test-impact-001")
	require.NoError(t, err)
	require.False(t, verified)

	// Second confirmation — still PENDING.
	verified, err = k.VerifyImpact(ctx, oracle2, "test-impact-001")
	require.NoError(t, err)
	require.False(t, verified)

	// Third confirmation — crosses threshold → VERIFIED.
	verified, err = k.VerifyImpact(ctx, oracle3, "test-impact-001")
	require.NoError(t, err)
	require.True(t, verified)

	r, _ := k.GetRecord(ctx, "test-impact-001")
	require.Equal(t, types.StatusVerified, r.Status)
	require.Equal(t, uint64(3), r.OracleConfirmations)

	// Rewards must have been triggered.
	require.Contains(t, rk.distributed, "test-impact-001")
}

func TestVerifyImpact_DuplicateOraclePrevented(t *testing.T) {
	k, ctx, _, _ := setupImpactKeeper(t)

	record := types.ImpactRecord{
		ID:                "test-impact-002",
		Provider:          provider,
		ImpactType:        types.TypeClimate,
		Status:            types.StatusPending,
		OracleConfirmations: 0,
		ConfirmingOracles: []string{},
	}
	k.SetRecord(ctx, record)

	_, err := k.VerifyImpact(ctx, oracle1, "test-impact-002")
	require.NoError(t, err)

	// Same oracle tries again — must be rejected.
	_, err = k.VerifyImpact(ctx, oracle1, "test-impact-002")
	require.ErrorIs(t, err, types.ErrDuplicateConfirm)
}

func TestVerifyImpact_InactiveOracleRejected(t *testing.T) {
	k, ctx, ok, _ := setupImpactKeeper(t)
	ok.active[oracle1] = false

	record := types.ImpactRecord{
		ID:     "test-impact-003",
		Status: types.StatusPending,
		ConfirmingOracles: []string{},
	}
	k.SetRecord(ctx, record)

	_, err := k.VerifyImpact(ctx, oracle1, "test-impact-003")
	require.ErrorIs(t, err, types.ErrNotOracle)
}

func TestVerifyImpact_AlreadyVerifiedImmutable(t *testing.T) {
	k, ctx, _, _ := setupImpactKeeper(t)

	record := types.ImpactRecord{
		ID:     "test-impact-004",
		Status: types.StatusVerified,
		ConfirmingOracles: []string{},
	}
	k.SetRecord(ctx, record)

	_, err := k.VerifyImpact(ctx, oracle1, "test-impact-004")
	require.ErrorIs(t, err, types.ErrAlreadyVerified)
}

// ─── RejectImpact ─────────────────────────────────────────────────────────────

func TestRejectImpact_Success(t *testing.T) {
	k, ctx, _, _ := setupImpactKeeper(t)

	record := types.ImpactRecord{
		ID:     "test-impact-005",
		Status: types.StatusPending,
		ConfirmingOracles: []string{},
	}
	k.SetRecord(ctx, record)

	err := k.RejectImpact(ctx, oracle1, "test-impact-005", "fraudulent data")
	require.NoError(t, err)

	r, _ := k.GetRecord(ctx, "test-impact-005")
	require.Equal(t, types.StatusRejected, r.Status)
}

func TestRejectImpact_CannotRejectVerified(t *testing.T) {
	k, ctx, _, _ := setupImpactKeeper(t)

	record := types.ImpactRecord{
		ID:     "test-impact-006",
		Status: types.StatusVerified,
		ConfirmingOracles: []string{},
	}
	k.SetRecord(ctx, record)

	err := k.RejectImpact(ctx, oracle1, "test-impact-006", "too late")
	require.ErrorIs(t, err, types.ErrAlreadyVerified)
}
