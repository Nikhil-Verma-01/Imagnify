import { Collection } from "@/components/shared/Collection"
import { navLinks } from "@/constants"
import { getAllImages } from "@/lib/actions/image.actions"
import { getOrCreateUser } from "@/lib/actions/user.actions"
import { auth } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"

const Home = async ({ searchParams }: SearchParamProps) => {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams?.page;
  const queryParam = resolvedSearchParams?.query;
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  const searchQuery = (Array.isArray(queryParam) ? queryParam[0] : queryParam) || '';
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <section className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-5 text-center">
        <div className="flex items-center gap-3">
          <Image src="/assets/images/logo-icon.svg" alt="Imagnify logo" width={44} height={44} />
          <h1 className="h2-bold text-dark-600">Imagnify</h1>
        </div>
        <p className="p-16-medium text-dark-400">Kindly Login First</p>
        <Link href="/sign-in" className="button w-fit bg-purple-gradient bg-cover text-white">
          Login
        </Link>
      </section>
    );
  }

  const user = await getOrCreateUser(userId);

  const images = await getAllImages({ page, searchQuery, userId: user?._id })

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Imaginify
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  )
}

export default Home
