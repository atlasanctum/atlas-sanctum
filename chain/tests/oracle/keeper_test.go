package oracle_test

import (
	"testing"

	"cosmossdk.io/log"
	storetypes "cosmossdk.io/store/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	oraclekeeper "github.com/atlashumanitarian/sanctum/x/oracle/keeper"
	"github.com/atlashumanitarian/sanctum/x/oracle/types"
)

// ─── Mock ─────────────────────────────────────────────────────────────────────

type mockIdentityKeeper struct{ roles map[string]string }

func (m *mockIdentityKeeper) GetUserRole(_ sdk.Context, addr string) (string, bool) {
	r, ok := m.roles[addr]
	return r, ok
}

// ─── Setup ────────────────────────────────────────────────────────────────────

const (
	adminAddr  = "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl"
	oracleAddr = "cosmos1qnk2n4nlkpw9xfqntladh74er2xa62wgas3eak"
)

func setupOracleKeeper(t *testing.T) (oraclekeeper.Keeper, sdk.Context) {
	t.Helper()
	key := storetypes.NewKVStoreKey(types.StoreKey)
	ik := &mockIdentityKeeper{roles: map[string]string{adminAddr: "ADMIN"}}
	k := oraclekeeper.NewKeeper(codec.NewProtoCodec(nil), key, log.NewNopLogger(), ik)
	return k, sdk.Context{}
}

// ─── Tests ────────────────────────────────────────────────────────────────────

func TestRegisterOracle_Success(t *testing.T) {
	k, ctx := setupOracleKeeper(t)
	err := k.RegisterOracle(ctx, oracleAddr, types.OracleTypeHuman)
	require.NoError(t, err)

	o, ok := k.GetOracle(ctx, oracleAddr)
	require.True(t, ok)
	require.True(t, o.Active)
	require.Equal(t, types.OracleTypeHuman, o.OracleType)
}

func TestRegisterOracle_DuplicateForbidden(t *testing.T) {
	k, ctx := setupOracleKeeper(t)
	require.NoError(t, k.RegisterOracle(ctx, oracleAddr, types.OracleTypeHuman))
	err := k.RegisterOracle(ctx, oracleAddr, types.OracleTypeHuman)
	require.ErrorIs(t, err, types.ErrDuplicateOracle)
}

func TestSuspendOracle_AdminOnly(t *testing.T) {
	k, ctx := setupOracleKeeper(t)
	require.NoError(t, k.RegisterOracle(ctx, oracleAddr, types.OracleTypeAPI))

	// Non-admin cannot suspend.
	err := k.SuspendOracle(ctx, oracleAddr, oracleAddr, "test")
	require.ErrorIs(t, err, types.ErrUnauthorized)
}

func TestSuspendOracle_Success(t *testing.T) {
	k, ctx := setupOracleKeeper(t)
	require.NoError(t, k.RegisterOracle(ctx, oracleAddr, types.OracleTypeAPI))

	err := k.SuspendOracle(ctx, adminAddr, oracleAddr, "misbehavior")
	require.NoError(t, err)

	o, _ := k.GetOracle(ctx, oracleAddr)
	require.False(t, o.Active)
	require.False(t, k.IsActiveOracle(ctx, oracleAddr))
}

func TestReactivateOracle_Success(t *testing.T) {
	k, ctx := setupOracleKeeper(t)
	require.NoError(t, k.RegisterOracle(ctx, oracleAddr, types.OracleTypeSensor))
	require.NoError(t, k.SuspendOracle(ctx, adminAddr, oracleAddr, "test"))

	err := k.ReactivateOracle(ctx, adminAddr, oracleAddr)
	require.NoError(t, err)

	require.True(t, k.IsActiveOracle(ctx, oracleAddr))
}

func TestGetActiveOracles_FiltersInactive(t *testing.T) {
	k, ctx := setupOracleKeeper(t)
	addr2 := "cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh"

	require.NoError(t, k.RegisterOracle(ctx, oracleAddr, types.OracleTypeHuman))
	require.NoError(t, k.RegisterOracle(ctx, addr2, types.OracleTypeAPI))
	require.NoError(t, k.SuspendOracle(ctx, adminAddr, addr2, "test"))

	active := k.GetActiveOracles(ctx)
	require.Len(t, active, 1)
	require.Equal(t, oracleAddr, active[0].Address)
}

func TestInvalidOracleType(t *testing.T) {
	msg := &types.MsgRegisterOracle{Address: oracleAddr, OracleType: "ROBOT"}
	require.ErrorIs(t, msg.ValidateBasic(), types.ErrInvalidType)
}
