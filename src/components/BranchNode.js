import "./BranchNode.css";

const BranchNode = ({ ideate, envisionTheSkiesEveryGrea }) => {
  return (
    <section className="branch-node">
      <div className="leaf-node">
        <h1 className="ideate">{ideate}</h1>
        <div className="parent-node" />
        <div className="envision-the-skies">{envisionTheSkiesEveryGrea}</div>
      </div>
    </section>
  );
};

export default BranchNode;
