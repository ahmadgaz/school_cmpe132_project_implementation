import Image from 'next/image';
import NavButton from '../ui/navbutton';
import PathnameState from '../state/pathnameState';

export default function Page() {
  return (
    <main className="relative flex flex-col items-center gap-10 px-3 pb-10">
      {/* Background Images */}
      <Image
        className="absolute"
        src="/hero-4.png"
        width={300}
        height={300}
        alt="hero-graphic"
        quality={100}
      />
      <div className="max-width relative bg-black ">
        <Image
          className="absolute -left-32 top-48"
          src="/hero-3.png"
          width={400}
          height={400}
          alt="hero-graphic"
          quality={100}
        />
      </div>

      {/* Content */}
      <section className="max-width flex items-center gap-40 rounded-[32px] border-[1px] border-accent-light bg-[#FFFAF4AA] px-[84px] py-[56px] backdrop-blur max-lg:justify-center max-lg:px-[64px] max-lg:py-[56px] lg:justify-between">
        <div className="flex flex-col gap-6 max-lg:items-center">
          <hgroup className="flex flex-col gap-2">
            <h1 className="text-[48px] font-semibold leading-[50px] tracking-tight text-text-black max-lg:text-center max-lg:text-[36px] max-lg:leading-[40px]">
              The <span className="logo-color font-bold">SJSUL</span> Management
              System.
            </h1>
            <h2 className="text-[16px] font-bold tracking-tight text-text-gray max-lg:text-center max-lg:text-[14px]">
              Embark on your next academic journey.
            </h2>
          </hgroup>
          <PathnameState>
            <NavButton
              className="button-primary w-fit"
              name="Start Learning Today"
              href="/signup"
            />
          </PathnameState>
        </div>
        <Image
          className="max-lg:hidden"
          src="/hero-1.png"
          width={400}
          height={400}
          alt="hero-graphic"
          quality={100}
        />
      </section>
      <section className="max-width flex items-center justify-between gap-40 px-[84px] py-[56px] max-lg:justify-center">
        <div className="flex flex-col gap-6 max-lg:items-center">
          <hgroup className="flex flex-col gap-2">
            <h1 className="text-[48px] font-semibold leading-[50px] tracking-tight text-text-black max-lg:text-center max-lg:text-[36px]">
              Manage your books easily
            </h1>
            <h2 className="text-[16px] font-bold tracking-tight text-text-gray max-lg:text-center max-lg:text-[14px]">
              Keep track of your all your books.
            </h2>
          </hgroup>
        </div>
        <Image
          className="max-lg:hidden"
          src="/hero-2.png"
          width={400}
          height={400}
          alt="hero-graphic"
          quality={100}
        />
      </section>
    </main>
  );
}
