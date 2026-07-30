package identity_test

import (
	"testing"

	"cosmossdk.io/log"
	"cosmossdk.io/math"
	storetypes "cosmossdk.io/store/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	identitykeeper "github.com/atlashumanitarian/sanctum/x/identity/keeper"
	"github.com/atlashumanitarian/sanctum/x/identity/types"
)

// ─── Test helpers ─────────────────────────────────────────────────────────────

func setupKeeper(t *testing.T) (identitykeeper.Keeper, sdk.Context) {
	t.Helper()
	key := storetypes.NewKVStoreKey(types.StoreKey)
	ctx := testContext(key)
	k := identitykeeper.NewKeeper(codec.NewProtoCodec(nil), key, log.NewNopLogger())
	return k, ctx
}

// testContext creates a minimal SDK context backed by an in-memory store.
func testContext(key *storetypes.KVStoreKey) sdk.Context {
	db := dbm.NewMemDB()
	cms := store.NewCommitMultiStore(db, log.NewNopLogger(), metrics.NewNoOpMetrics())
	cms.MountStoreWithDB(key, storetypes.StoreTypeIAVL, db)
	_ = cms.LoadLatestVersion()
	return sdk.NewContext(cms, false, log.NewNopLogger())
}

const (
	addr1 = "cosmos1qnk2n4nlkpw9xfqntladh74er2xa62wgas3eak"
	addr2 = "cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh"
	admin = "cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl"
)

// ─── RegisterUser ─────────────────────────────────────────────────────────────

func TestRegisterUser_Success(t *testing.T) {
	k, ctx := setupKeeper(t)
	err := k.RegisterUser(ctx, addr1, types.RoleUser, "test metadata")
	require.NoError(t, err)

	u, ok := k.GetUser(ctx, addr1)
	require.True(t, ok)
	require.Equal(t, addr1, u.Address)
	require.Equal(t, types.RoleUser, u.Role)
	require.True(t, u.ReputationScore.IsZero())
}

func TestRegisterUser_DuplicateForbidden(t *testing.T) {
	k, ctx := setupKeeper(t)
	require.NoError(t, k.RegisterUser(ctx, addr1, types.RoleUser, ""))
	err := k.RegisterUser(ctx, addr1, types.RoleUser, "")
	require.ErrorIs(t, err, types.ErrDuplicateUser)
}

func TestRegisterUser_MetadataTooLong(t *testing.T) {
	k, ctx := setupKeeper(t)
	longMeta := make([]byte, types.MetadataMaxLen+1)
	msg := types.NewMsgRegisterUser(addr1, types.RoleUser, string(longMeta))
	require.ErrorIs(t, msg.ValidateBasic(), types.ErrMetadataTooLong)
}

func TestRegisterUser_InvalidRole(t *testing.T) {
	msg := types.NewMsgRegisterUser(addr1, "HACKER", "")
	require.ErrorIs(t, msg.ValidateBasic(), types.ErrInvalidRole)
}

// ─── UpdateReputation ─────────────────────────────────────────────────────────

func TestUpdateReputation_AdminOnly(t *testing.T) {
	k, ctx := setupKeeper(t)
	require.NoError(t, k.RegisterUser(ctx, addr1, types.RoleUser, ""))
	require.NoError(t, k.RegisterUser(ctx, addr2, types.RoleUser, ""))

	// Non-admin cannot update reputation.
	err := k.UpdateReputation(ctx, addr2, addr1, math.LegacyNewDec(10))
	require.ErrorIs(t, err, types.ErrUnauthorized)
}

func TestUpdateReputation_Success(t *testing.T) {
	k, ctx := setupKeeper(t)
	require.NoError(t, k.RegisterUser(ctx, admin, types.RoleAdmin, ""))
	require.NoError(t, k.RegisterUser(ctx, addr1, types.RoleUser, ""))

	err := k.UpdateReputation(ctx, admin, addr1, math.LegacyNewDec(50))
	require.NoError(t, err)

	u, _ := k.GetUser(ctx, addr1)
	require.Equal(t, math.LegacyNewDec(50), u.ReputationScore)
}

func TestUpdateReputation_FloorAtZero(t *testing.T) {
	k, ctx := setupKeeper(t)
	require.NoError(t, k.RegisterUser(ctx, admin, types.RoleAdmin, ""))
	require.NoError(t, k.RegisterUser(ctx, addr1, types.RoleUser, ""))

	// Negative delta should floor at zero, not go negative.
	err := k.UpdateReputation(ctx, admin, addr1, math.LegacyNewDec(-100))
	require.NoError(t, err)

	u, _ := k.GetUser(ctx, addr1)
	require.True(t, u.ReputationScore.IsZero())
}

// ─── GetUsersByRole ───────────────────────────────────────────────────────────

func TestGetUsersByRole(t *testing.T) {
	k, ctx := setupKeeper(t)
	require.NoError(t, k.RegisterUser(ctx, addr1, types.RoleOracle, ""))
	require.NoError(t, k.RegisterUser(ctx, addr2, types.RoleUser, ""))
	require.NoError(t, k.RegisterUser(ctx, admin, types.RoleAdmin, ""))

	oracles := k.GetUsersByRole(ctx, types.RoleOracle)
	require.Len(t, oracles, 1)
	require.Equal(t, addr1, oracles[0].Address)
}

// ─── UpdateMetadata ───────────────────────────────────────────────────────────

func TestUpdateMetadata_NotFound(t *testing.T) {
	k, ctx := setupKeeper(t)
	err := k.UpdateMetadata(ctx, addr1, "new meta")
	require.ErrorIs(t, err, types.ErrUserNotFound)
}

func TestUpdateMetadata_Success(t *testing.T) {
	k, ctx := setupKeeper(t)
	require.NoError(t, k.RegisterUser(ctx, addr1, types.RoleUser, "old"))
	require.NoError(t, k.UpdateMetadata(ctx, addr1, "new"))
	u, _ := k.GetUser(ctx, addr1)
	require.Equal(t, "new", u.Metadata)
}
