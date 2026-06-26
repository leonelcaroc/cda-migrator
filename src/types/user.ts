export type User = {
  id: string;
  lastname: string;
  firstname: string;
  middlename: string;
  suffix: string;
  mobile: string;
  email: string;
  gender: string;
  address: string;
  id_type: string;
  id_no: string;
  password: string;
  //   role_name     String?
  //   verified_at   DateTime?
  //   created_at    DateTime?  @default(now())
  //   updated_at    DateTime?  @updatedAt
  //   deleted_at    DateTime?
  //   status        UserStatus @default(PENDING)
  status: string;
  //   refreshToken  String?    @unique
  //   firebaseToken String?
  //   firebaseUid   String?    @unique
  //   provider      String? // e.g., "auth0", "local"
  migrated: number; // 1 if migrated, 0 if not
  //   last_successful_login_at DateTime?
  //   loginSessions LoginSession[]
  //   supportTickets SupportTicket[]
};
