# Security Specification: StudentHelper Campus Service

## 1. Data Invariants
1. A student cannot alter the `role` field in their own user record or promote themselves to `ADMIN` or `STAFF`.
2. Admin documents under `/admins/{adminId}` cannot be created or modified by arbitrary client authentication.
3. An Order must have a valid `userId` matching `request.auth.uid` upon creation.
4. Total amount cannot be negative.
5. Students cannot modify order `status` to bypass payment or fake fulfillment. Only staff or admins can transition statuses.
6. Pricing documents can only be updated by verified admins.
7. Orders in terminal state (`COMPLETED` or `CANCELLED`) cannot be modified by students.

## 2. The "Dirty Dozen" Threat Payloads
1. **Self-Escalation Attack**: Student registers and writes `role: "ADMIN"` to `/users/{uid}`.
2. **Admin Whitelist Injection**: Student attempts to write a document at `/admins/{uid}`.
3. **Impersonated Order Creation**: User A submits an order with `userId: "user-B"`.
4. **Price Tampering**: Client submits totalAmount: -100 or totalAmount: 0.01 for a 500-page color job.
5. **Unauthorized Status Overwrite**: Student updates order status directly to `COMPLETED`.
6. **Negative Quantity Exploit**: Assignment order placed with `quantity: -5`.
7. **Junk Character Path Variable Injection**: Document ID with 2KB payload or directory traversal characters.
8. **PII Snoop Attack**: Student A attempts to read full private profile of Student B.
9. **Global Pricing Hijack**: Unauthenticated user attempts to overwrite `/pricing/default`.
10. **Re-Opening Terminal Order**: Student modifies note or file on an already `COMPLETED` order.
11. **Chat Spoofing**: User sends a message pretending to have `senderRole: "ADMIN"`.
12. **Staff Invitation Injection**: Non-admin attempts to add a new operator in staff management collection.

## 3. Test Runner Blueprint
All 12 attack vectors are tested to guarantee `PERMISSION_DENIED` across all single-document and list operations.
