import "./Subtree.css";

const Subtree = () => {
  return (
    <section className="subtree">
      <div className="root-node">
        <div className="ancestor-nodes">
          <img
            className="descendant-nodes-icon"
            alt=""
            src="/descendant-nodes.svg"
          />
          <div className="tree-structure">
            <div className="edge-connection">
              <div className="where-vision-meets">
                Where vision meets velocity.
              </div>
              <h1 className="game-dev-on">Game Dev on the Fly</h1>
            </div>
            <div className="branch-split">
              <div className="our-core-principles">
                Our core principles revolve around breaking the barriers of
                traditional game development timelines. We value innovation,
                efficiency, and speed, ensuring your game not only sees the
                light of day but does so faster than you thought possible.
              </div>
            </div>
            <button className="button2">
              <div className="button3">book a call</div>
            </button>
          </div>
          <div className="root-branch">
            <div className="sub-branches">
              <div className="smallcard">
                <img
                  className="lightning-bolt-icon"
                  alt=""
                  src="/lightning-bolt.svg"
                />
                <div className="get-to-the">Get to the Market Quicker</div>
              </div>
              <div className="smallcard1">
                <img className="hand-icon" alt="" src="/hand.svg" />
                <div className="get-to-the1">Grab Oppurtunities Faster</div>
              </div>
              <div className="smallcard2">
                <img className="rocket-icon" alt="" src="/rocket.svg" />
                <div className="get-to-the2">Stay Ahead of Trends</div>
              </div>
            </div>
            <div className="with-swift-its">
              With Swift, it's not just about saving time; it's about leveraging
              time to your advantage, ensuring your game has the impact it
              deserves.
            </div>
          </div>
        </div>
        <img
          className="downanimation-icon"
          loading="lazy"
          alt=""
          src="/downanimation.svg"
        />
        <img
          className="root-node-child"
          loading="lazy"
          alt=""
          src="/group-36.svg"
        />
        <img className="swift-icon" loading="lazy" alt="" src="/swift.svg" />
        <header className="navbar1">
          <nav className="branch-merger">
            <div className="navitems4">
              <div className="click-link4">Problems</div>
            </div>
            <div className="navitems5">
              <div className="click-link5">Solution</div>
            </div>
            <div className="navitems6">
              <div className="click-link6">Services</div>
            </div>
            <div className="navitems7">
              <div className="click-link7">FAQ</div>
            </div>
          </nav>
          <div className="button4">
            <div className="button5">book a call</div>
          </div>
        </header>
      </div>
      <button className="button6">
        <div className="button7">BOOK A CALL</div>
      </button>
    </section>
  );
};

export default Subtree;
