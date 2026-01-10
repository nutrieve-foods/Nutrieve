import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Nutrieve – Natural Vegetable Powders & Healthy Foods</title>
        <meta
          name="description"
          content="Nutrieve offers premium vegetable powders like onion, garlic, tomato, spinach and more. 100% natural and hygienic."
        />
        <link rel="canonical" href="https://www.nutrieve.in/" />
      </Helmet>

      <section>
        <h1>Nutrieve – Natural Vegetable Powders</h1>
        <p>Premium dehydrated vegetable powders for healthy living.</p>
      </section>
    </>
  );
};

export default Home;
