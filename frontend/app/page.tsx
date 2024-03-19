import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "blue" })}>INTV-DEMO&nbsp;</h1>
        <br />
        <h2 className={subtitle({ class: "mt-4" })}>
          {siteConfig.description}
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          href={siteConfig.navItems[2]?.href}
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow"
          })}
        >
          Dashboard
        </Link>
      </div>
    </section>
  );
}
