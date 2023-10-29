'use client';
import { useRouter } from 'next/navigation';

export default function LoginModal() {
  const router = useRouter();
  return (
    <>
      <span onClick={() => router.back()}>Close modal</span>
      <iframe width='500' height='500' src='/api/auth/signin'></iframe>
      {/* <Modal>
        <span onClick={() => router.back()}>Close modal</span>
        <h1>Login</h1>
        <h2>Content to login</h2>
      </Modal> */}
    </>
  );
}
