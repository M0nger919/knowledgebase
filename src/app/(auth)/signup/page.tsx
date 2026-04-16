import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-500 mt-2">
            Get started with Knowbase for free
          </p>
        </div>
        <form className="space-y-4">
          <Input label="Full name" type="text" placeholder="Jane Doe" />
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Button className="w-full" type="submit">
            Sign up
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
