import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import landingPageImg from "@/assets/landing-page.png";
import Image from "next/image";
import Button from "@/components/Button";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center gap-3">
      <h1 className="text-3xl font-secondary">Simplify Your Meal Planning</h1>
      <figure className="rounded-full shadow-2xl">
        <Image
          src={landingPageImg}
          width={300}
          height={300}
          alt="Landing Page"
          className="rounded-full shadow-2xl"
        ></Image>
      </figure>
      <p className="font-primary italic">
        Deciding what to eat has never been easier.
      </p>
      <Button>
        <FontAwesomeIcon icon={faArrowRight} className="w-6" size="3x"/>
      </Button>
    </main>
  );
}
