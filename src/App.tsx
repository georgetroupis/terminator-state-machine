import { terminator } from "./stateMachine/machine";
import { useMachine } from "@xstate/react";
import human from "./static/man_emoji.jpeg";

function App() {
  const [state, send] = useMachine(terminator);

  return (
    <div style={{ margin: "50px" }}>
      {/** You can send events to the running service */}

      <h1>Terminator State Machine</h1>
      <div style={{ display: "flex" }}>
        <h2 style={{ margin: "20px" }}>
          CURRENT STATE: <i>{state.value.toString()}</i>
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <button
          style={{ fontSize: "15px" }}
          onClick={() => send("PROTECT_HUMAN")}
        >
          PROTECT_HUMAN 🛡️
        </button>
        <button onClick={() => send("ASSIGN_HUMAN")}>ASSIGN_HUMAN 👨</button>
        <button onClick={() => send("RELIEVE_DUTY")}>RELIEVE_DUTY 😮‍💨</button>
        <button onClick={() => send("TURN_OFF")}>TURN_OFF 🚫</button>
      </div>

      <div
        style={{ backgroundColor: "white", padding: "5px", marginTop: "10px" }}
      >
        {`unassignedHumans: [${state.context.unassignedHumans}]`}
        {state.context.unassignedHumans.map((_human) => {
          return <img src={human} alt="human" height={20} width={20} />;
        })}
        <br />
        {`humanAssigned: ${state.context.humanAssigned ?? "none"}`}
        {state.context.humanAssigned && (
          <img src={human} alt="human" height={20} width={20} />
        )}
        <br />
        {`relocatedToHuman: ${state.context.relocatedToHuman}`}
      </div>
    </div>
  );
}

export default App;
