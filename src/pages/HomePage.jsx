import { useEffect, useState } from "react";
import { Link } from "react-router";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { SkeletonEventCard } from "../components/Skeleton";
import styles from "./HomePage.module.css";
import { getEvents } from "../services/events.js";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      setError(null);

      try{
        const data = await getEvents();
        setEvents(data);

      } catch (error) {
        setError("Der opstod en fejl. Prøv at genindlæse siden.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const categories = ["Alle", ...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const searchText = `${event.title} ${event.summary} ${event.venue.name}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return (
    <>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className={styles.heroCopy}>
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className={styles.heroLink} href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrowDark}>Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className={styles.filters}>
          <h2 className="sr-only">Filtrer events</h2>
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        <section className={styles.eventGrid} aria-busy={isLoading}>
          {isLoading && (
            <>
              <p role="status" className="sr-only">
                Indlæser events…
              </p>
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonEventCard key={index} />
              ))}
            </>
          )}
          {!isLoading && error && (
            <p className={styles.message} role="alert">
              {error}
            </p>
          )}
          {!isLoading && !error && filteredEvents.length === 0 && (
            <p className={styles.message} role="status">
              Ingen events matcher din søgning.
            </p>
          )}
          {!isLoading &&
            !error &&
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
