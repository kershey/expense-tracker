import Link from 'next/link';
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl text-zinc-400 font-extrabold sm:text-5xl">
            Spend Smart.
            <strong className="font-extrabold text-primary sm:block">
              {' '}
              Save Smarter.{' '}
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Effortlessly track your expenses, set budgets, and achieve your
            financial goals—all in one place. Stay organized, save smarter, and
            see where your money goes with real-time insights.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-zinc-400 focus:outline-none focus:ring active:bg-zinc-400 sm:w-auto"
              href="/dashboard"
            >
              Get Started
            </Link>

            <a
              className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow hover:text-zinc-400 focus:outline-none focus:ring active:text-zinc-400 sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
