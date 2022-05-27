import Show from "../components/Show";
import styles from "./shows.module.css";
import Layout from "../components/layout";
import shows from "../data/shows";
import Head from "next/head";

export const getStaticProps = async () => {
  return {
    props: {
      shows,
    },
  };
};

export default function Shows(props) {
  return (
    <>
      <Head>
        <title>Joe Day Shows</title>
        <meta property="og:title" content="Joe Day &amp; John Van Deusen" />
        <meta
          property="og:description"
          content="Living room shows on sale now"
        />
        <meta property="og:image" content="/jvd_jd_tickets.jpg" />
        <meta property="og:url" content="https://joedaymusic.com/shows" />
        <meta property="og:type" content="website" />
      </Head>
      <Layout home>
        <div className={styles.showsGrid}>
          <h1 className={styles.articleTitle}>Upcoming shows</h1>
          <h1>{props.greeting}</h1>
          <section className={styles.shows}>
            <ul className={styles.upcomingShowsList}>
              {props.shows.length != 0
                ? props.shows.map((showInfo) => (
                    <Show {...showInfo} key={showInfo.id} />
                  ))
                : "Nothing scheduled at the moment"}
            </ul>

            <section className={styles.booking}>
              <p className={styles.divider}>+ + +</p>
              <p className={styles.bookingCopy}>
                For booking, email:{" "}
                <a
                  className={styles.emailLink}
                  href="mailto:booking@joedaymusic.com"
                >
                  booking@joedaymusic.com
                </a>
              </p>
              <p className={styles.divider}>+ + +</p>
            </section>
          </section>
        </div>
      </Layout>
    </>
  );
}
