import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import Link from 'next/link';

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="#">
              <span className="sr-only">Home</span>
              <Link href="/">
                <Image src={logo} alt="logo" width={160} height={100} />
              </Link>
            </a>
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to Expense Tracker
            </h1>
            <p className="mt-4 mb-5 leading-relaxed text-gray-500">
              Welcome! Sign up to track your expenses, manage your budget, and
              stay in control of your finances. Let’s make smarter financial
              decisions together!
            </p>
            <SignUp />
          </div>
        </main>
      </div>
    </section>
  );
}
