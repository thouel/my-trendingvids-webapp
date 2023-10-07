export default function LoginPage() {
  return (
    <iframe
      width='500'
      height='500'
      src='/api/auth/signin?callbackUrl=/'
    ></iframe>
  );
}
