# Documently — user documentation

## Purpose
Documently helps people search documents and ask questions about their content. The interface is responsive and works with keyboards and screen readers.

## Quick start
1. Open **Application**.
2. Create a workspace.
3. Add PDF files.
4. Open the **Chat** tab and enter a question.
5. Verify the answer against the source before using it in your work.

## Accessibility
- Every feature is keyboard accessible.
- Controls have labels, roles and accessible states.
- Contrast targets WCAG 2.2 AA.
- The interface respects `prefers-reduced-motion`.

## Errors
Interface errors and rejected operations are captured globally. The message contains a clear hint, context and a shortened event id. Secrets and stack traces are never shown to the user.

## Data and security
A production deployment should enforce Supabase RLS, validate file type and size on the server, and keep keys only in environment variables.
