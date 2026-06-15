import { Link } from "react-router";
import { Film, Music, Gamepad2, BookOpen, Star, Tv } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";

export function HomePage() {
  const categories = [
    {
      title: "Фільми",
      description: "Оцінюй кіношедеври",
      icon: Film,
      path: "/movies",
      image: "https://st2.depositphotos.com/1105977/9877/i/450/depositphotos_98775856-stock-photo-retro-film-production-accessories-still.jpg",
    },
    {
      title: "Серіали",
      description: "Оцінюй епізоди",
      icon: Tv,
      path: "/tvshows",
      image: "https://static.ffx.io/images/$zoom_0.369140625%2C$multiply_0.7725%2C$ratio_1.5%2C$width_756%2C$x_0%2C$y_0/t_crop_custom/q_86%2Cf_auto/45945ae17062bbcc507a504a27cedbf2b22ab8e1",
    },
    {
      title: "Музика",
      description: "Відкривай нові треки",
      icon: Music,
      path: "/music",
      image: "https://content.presspage.com/uploads/1660/5588f20b-2359-41d0-ab3d-280cd49626ba/1920_image-musictech.square.jpg?10000",
    },
    {
      title: "Ігри",
      description: "Ділись думками",
      icon: Gamepad2,
      path: "/games",
      image: "https://gmedia.playstation.com/is/image/SIEPDC/the-crew-motorfest-hero-banner-desktop-01-en-30may23?$native$",
    },
    {
      title: "Книги",
      description: "Рекомендуй улюблені",
      icon: BookOpen,
      path: "/books",
      image: "https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=754&fit=clip",
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-12 lg:py-20">
        <div className="inline-flex items-center justify-center">
          <div className="relative">
            <Star className="size-16 text-white" />
            <Star className="size-16 text-white absolute inset-0 blur-xl opacity-30" />
          </div>
        </div>
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-extralight text-white tracking-tight">
            Оцінюй те, що любиш
          </h1>
          <p className="text-lg lg:text-xl text-zinc-400 font-light max-w-2xl mx-auto">
            Діліться думками про фільми, серіали, музику, ігри та книги
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.path}
              to={category.path}
              className="group relative overflow-hidden rounded-2xl aspect-[16/9] bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700/50 transition-all"
            >
              <ImageWithFallback
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-all duration-700 group-hover:scale-105"
              />
              
              <div className="relative h-full flex flex-col justify-end p-8 lg:p-10">
                <div className="space-y-4">
                  <Icon className="size-8 text-white opacity-60" />
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-light text-white mb-2 tracking-tight">
                      {category.title}
                    </h2>
                    <p className="text-zinc-400 font-light">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="border border-zinc-800/50 rounded-2xl p-12 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div className="text-center space-y-3">
            <div className="text-5xl lg:text-6xl font-extralight text-white">1000+</div>
            <div className="text-zinc-400 font-light">Елементів контенту</div>
          </div>
          <div className="text-center space-y-3">
            <div className="text-5xl lg:text-6xl font-extralight text-white">5000+</div>
            <div className="text-zinc-400 font-light">Користувачів</div>
          </div>
          <div className="text-center space-y-3">
            <div className="text-5xl lg:text-6xl font-extralight text-white">50K+</div>
            <div className="text-zinc-400 font-light">Оцінок</div>
          </div>
        </div>
      </div>
    </div>
  );
}
