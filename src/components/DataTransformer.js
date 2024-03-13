import "./DataTransformer.css";

const DataTransformer = () => {
  return (
    <section className="data-transformer">
      <div className="filter-node1">
        <h1 className="got-questions">Got Questions?</h1>
        <div className="weve-got-answers">We've Got Answers.</div>
      </div>
      <div className="constant-node">
        <div className="faq">
          <div className="how-do-you">
            How do you ensure project deadlines are met?
          </div>
          <img
            className="union-icon1"
            loading="lazy"
            alt=""
            src="/union-1.svg"
          />
        </div>
        <div className="faq1">
          <input
            className="how-do-you1"
            placeholder="What about customization and unique features?"
            type="text"
          />
          <img className="union-icon2" alt="" src="/union-1.svg" />
        </div>
        <div className="faq2">
          <input
            className="how-do-you2"
            placeholder="Are there any hidden costs involved?"
            type="text"
          />
          <img className="union-icon3" alt="" src="/union-1.svg" />
        </div>
        <div className="faq3">
          <input
            className="how-do-you3"
            placeholder="What about the contracts?"
            type="text"
          />
          <img className="union-icon4" alt="" src="/union-1.svg" />
        </div>
      </div>
    </section>
  );
};

export default DataTransformer;
