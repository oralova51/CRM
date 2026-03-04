export type ServerResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
};

export type LoyaltyLevel = {
    id: number;
    name: string;
    min_spent: number;
    discount_pct: number;
    created_at: string;
    updated_at: string;
};
export type UserLoyaltyData = {
    discount: number;
};

export type UserLoyaltyLevel = ServerResponseType<UserLoyaltyData>;

export type LoyaltyLevelResponse = ServerResponseType<LoyaltyLevel>;
export type LoyaltyLevelArrayType = LoyaltyLevelResponse[];