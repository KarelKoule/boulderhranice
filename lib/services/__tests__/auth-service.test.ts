import { describe, expect, it, vi } from "vitest";
import { AuthService } from "../auth-service";

function createMockClient(overrides: {
  user?: Record<string, unknown> | null;
  profile?: Record<string, unknown> | null;
} = {}) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: overrides.user ?? null },
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({
            data: overrides.profile ?? null,
          }),
        }),
      }),
    }),
  } as never;
}

describe("getCurrentUser", () => {
  it("returns null when no user is authenticated", async () => {
    const service = new AuthService(createMockClient({ user: null }));
    expect(await service.getCurrentUser()).toBeNull();
  });

  it("uses profile display_name for Google user", async () => {
    const service = new AuthService(createMockClient({
      user: {
        id: "u1",
        email: "jan@example.com",
        user_metadata: { full_name: "Jan Novák", avatar_url: "https://example.com/avatar.jpg" },
      },
      profile: { display_name: "Jan Novák", avatar_url: "https://example.com/avatar.jpg" },
    }));

    const result = await service.getCurrentUser();
    expect(result).toEqual({
      id: "u1",
      displayName: "Jan Novák",
      avatarUrl: "https://example.com/avatar.jpg",
    });
  });

  it("falls back to email when profile display_name is empty", async () => {
    const service = new AuthService(createMockClient({
      user: {
        id: "u2",
        email: "user@example.com",
        user_metadata: {},
      },
      profile: { display_name: "", avatar_url: null },
    }));

    const result = await service.getCurrentUser();
    expect(result).toEqual({
      id: "u2",
      displayName: "user@example.com",
      avatarUrl: null,
    });
  });

  it("falls back to user_metadata full_name when profile display_name is empty", async () => {
    const service = new AuthService(createMockClient({
      user: {
        id: "u3",
        email: "jan@example.com",
        user_metadata: { full_name: "Jan Novák" },
      },
      profile: { display_name: "", avatar_url: null },
    }));

    const result = await service.getCurrentUser();
    expect(result).toEqual({
      id: "u3",
      displayName: "Jan Novák",
      avatarUrl: null,
    });
  });

  it("falls back to email when no profile exists", async () => {
    const service = new AuthService(createMockClient({
      user: {
        id: "u4",
        email: "solo@example.com",
        user_metadata: {},
      },
      profile: null,
    }));

    const result = await service.getCurrentUser();
    expect(result).toEqual({
      id: "u4",
      displayName: "solo@example.com",
      avatarUrl: null,
    });
  });
});
