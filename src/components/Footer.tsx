import { Hexagon,  Github } from "lucide-react";
import { FooterUI } from "@/components/ui/footer";

const Footer = () => {
  return (
    <div className="w-full">
      <FooterUI
        logo={<Hexagon className="h-10 w-10" />}
        brandName="Clash Base Hub"
        socialLinks={[
          {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/vichea69",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "/products", label: "Products" },
          { href: "/about", label: "About" },
          { href: "/blog", label: "Blog" },
          { href: "/contact", label: "Contact" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: `© ${new Date().getFullYear()} Clash Base Hub`,
          license: "All rights reserved",
        }}
      />
    </div>
  );
};

export default Footer;
