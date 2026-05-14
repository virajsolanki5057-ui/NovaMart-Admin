import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Commerce OS Login | Admin Panel"
        description="Secure login for your ecommerce admin panel with role-based authentication."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
