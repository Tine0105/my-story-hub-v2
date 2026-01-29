import { Facebook, Music2, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <a href="#" className="font-display text-2xl font-bold text-foreground">
              MeoHi<span className="text-primary">.</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Du học sinh Trung Quốc • Chiêu sinh tiếng Trung online
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-background rounded-lg border border-border hover:border-primary hover:shadow-soft transition-all duration-300"
            >
              <Facebook size={20} className="text-muted-foreground hover:text-primary" />
            </a>
            <a
              href="https://www.tiktok.com/@chi_12321"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-background rounded-lg border border-border hover:border-primary hover:shadow-soft transition-all duration-300"
            >
              <Music2 size={20} className="text-muted-foreground hover:text-primary" />
            </a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-primary fill-primary" /> by MeoHi © 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
