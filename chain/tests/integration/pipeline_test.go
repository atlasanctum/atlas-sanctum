package integration_test

import (
	"testing"

	"cosmossdk.io/log"
	"cosmossdk.io/math"
	storetypes "cosmossdk.io/store/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	identitykeeper "github.com/atlashumanitarian/sanctum/x/identity/keeper"
	identitytypes "github.com/atlashumanitarian/sanctum/x/identity/types"
	impactkeeper "github.com/atlashumanitarian/sanctum/x/impact/keeper"
	impacttypes "github.com/atlashumanitarian/sanctum/x/impact/types"
	oraclekeeper "github.com/atlashumanitarian/sanctum/x/oracle/keeper"
	oracletypes "github.com/atlashumanitarian/sanctum/x/oracle/types"
)

// ─── Full pipeline: register → submit → verify × 3 → rewards ─────────────────

const (
	adminAddr    = "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl"
	providerAddr = "cosmos1qnk2n4nlkpw9xfqntladh74er2xa62wgas3eak"
	oracle1      = "cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh"
	oracle2      = "cosmos1s3nh6tafl4amaxkke9kdejhp09lk93g9ev39r4"
	oracle3      = "cosmos1v9jxgu33ta047h6lta047h6lta047h6lta047h"
)

type rewardsRecorder struct{ calls []string }

func (r *rewardsRecorder) DistributeForImpact(_ sdk.Context, rec impacttypes.ImpactRecord) error {
	r.calls = append(r.calls, rec.ID)
	return nil
}

func TestFullImpactVerificationPipeline(t *testing.T) {
	cdc := codec.NewProtoCodec(nil)
	ctx := sdk.Context{}

	// Wire keepers.
	idKey := storetypes.NewKVStoreKey(identitytypes.StoreKey)
	orKey := storetypes.NewKVStoreKey(oracletypes.StoreKey)
	imKey := storetypes.NewKVStoreKey(impacttypes.StoreKey)

	idKeeper := identitykeeper.NewKeeper(cdc, idKey, log.NewNopLogger())
	orKeeper := oraclekeeper.NewKeeper(cdc, orKey, log.NewNopLogger(), idKeeper)
	rewards := &rewardsRecorder{}
	imKeeper := impactkeeper.NewKeeper(cdc, imKey, log.NewNopLogger(), idKeeper, orKeeper, rewards)

	// 1. Register admin and provider.
	require.NoError(t, idKeeper.RegisterUser(ctx, adminAddr, identitytypes.RoleAdmin, ""))
	require.NoError(t, idKeeper.RegisterUser(ctx, providerAddr, identitytypes.RoleUser, ""))

	// 2. Register 3 oracles.
	for _, addr := range []string{oracle1, oracle2, oracle3} {
		require.NoError(t, orKeeper.RegisterOracle(ctx, addr, oracletypes.OracleTypeHuman))
	}

	// 3. Submit impact record.
	record := impacttypes.ImpactRecord{
		ID:                "integration-001",
		Provider:          providerAddr,
		ImpactType:        impacttypes.TypeHealth,
		Metric:            "patients_treated",
		Value:             math.LegacyNewDec(200),
		Status:            impacttypes.StatusPending,
		OracleConfirmations: 0,
		ConfirmingOracles: []string{},
	}
	imKeeper.SetRecord(ctx, record)

	// 4. Three oracle confirmations → VERIFIED.
	v1, err := imKeeper.VerifyImpact(ctx, oracle1, "integration-001")
	require.NoError(t, err)
	require.False(t, v1)

	v2, err := imKeeper.VerifyImpact(ctx, oracle2, "integration-001")
	require.NoError(t, err)
	require.False(t, v2)

	v3, err := imKeeper.VerifyImpact(ctx, oracle3, "integration-001")
	require.NoError(t, err)
	require.True(t, v3, "third confirmation must trigger VERIFIED")

	// 5. Assert final state.
	r, ok := imKeeper.GetRecord(ctx, "integration-001")
	require.True(t, ok)
	require.Equal(t, impacttypes.StatusVerified, r.Status)
	require.Equal(t, uint64(3), r.OracleConfirmations)

	// 6. Rewards must have been triggered exactly once.
	require.Len(t, rewards.calls, 1)
	require.Equal(t, "integration-001", rewards.calls[0])
}

func TestSuspendedOracleCannotVerify(t *testing.T) {
	cdc := codec.NewProtoCodec(nil)
	ctx := sdk.Context{}

	idKey := storetypes.NewKVStoreKey(identitytypes.StoreKey)
	orKey := storetypes.NewKVStoreKey(oracletypes.StoreKey)
	imKey := storetypes.NewKVStoreKey(impacttypes.StoreKey)

	idKeeper := identitykeeper.NewKeeper(cdc, idKey, log.NewNopLogger())
	orKeeper := oraclekeeper.NewKeeper(cdc, orKey, log.NewNopLogger(), idKeeper)
	imKeeper := impactkeeper.NewKeeper(cdc, imKey, log.NewNopLogger(), idKeeper, orKeeper, &rewardsRecorder{})

	require.NoError(t, idKeeper.RegisterUser(ctx, adminAddr, identitytypes.RoleAdmin, ""))
	require.NoError(t, orKeeper.RegisterOracle(ctx, oracle1, oracletypes.OracleTypeAPI))
	require.NoError(t, orKeeper.SuspendOracle(ctx, adminAddr, oracle1, "test suspension"))

	record := impacttypes.ImpactRecord{
		ID:                "integration-002",
		Status:            impacttypes.StatusPending,
		ConfirmingOracles: []string{},
	}
	imKeeper.SetRecord(ctx, record)

	_, err := imKeeper.VerifyImpact(ctx, oracle1, "integration-002")
	require.ErrorIs(t, err, impacttypes.ErrNotOracle)
}

func TestReputationUpdateRequiresAdmin(t *testing.T) {
	cdc := codec.NewProtoCodec(nil)
	ctx := sdk.Context{}
	key := storetypes.NewKVStoreKey(identitytypes.StoreKey)
	idKeeper := identitykeeper.NewKeeper(cdc, key, log.NewNopLogger())

	require.NoError(t, idKeeper.RegisterUser(ctx, providerAddr, identitytypes.RoleUser, ""))
	require.NoError(t, idKeeper.RegisterUser(ctx, oracle1, identitytypes.RoleOracle, ""))

	// Oracle tries to update provider reputation — must fail.
	err := idKeeper.UpdateReputation(ctx, oracle1, providerAddr, math.LegacyNewDec(100))
	require.ErrorIs(t, err, identitytypes.ErrUnauthorized)
}
