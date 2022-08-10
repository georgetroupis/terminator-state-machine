import { assign, createMachine } from "xstate";

type TerminatorContext = {
  unassignedHumans: Array<string>;
  humanAssigned?: string;
  relocatedToHuman: boolean;
};

export const terminator = createMachine<TerminatorContext>(
  {
    id: "terminator",
    initial: "idle",
    context: {
      unassignedHumans: ["John Connor", "Harry Potter"],
      relocatedToHuman: false,
    },
    states: {
      idle: {
        id: "idle",
        on: {
          TURN_OFF: "deactivated",
          PROTECT_HUMAN: {
            target: "protecting",
            cond: (context) => !!context.humanAssigned,
            actions: assign({
              relocatedToHuman: (_context) => true,
            }),
          },
          DISGUISE: "imitatingSubmachine",
          ASSIGN_HUMAN: {
            target: "idle",
            actions: "assignHuman",
          },
        },
      },
      deactivated: {
        type: "final",
      },
      protecting: {
        on: {
          RELIEVE_DUTY: {
            target: "idle",
            actions: assign({
              relocatedToHuman: (_context) => false,
              humanAssigned: (_context) => undefined,
            }),
          },
        },
      },
      imitatingSubmachine: {
        id: "imitateMachine",
        initial: "imitating",
        states: {
          imitating: {
            on: {
              REDISGUISE: "imitating",
              // guard: if looking at someone
              UNDISGUISE: {
                target: "#idle",
              },
              START_SPEAKING: "mimic_voice",
            },
          },
          mimic_voice: {
            on: {
              STOP_SPEAKING: "imitating",
            },
          },
        },
      },
    },
  },
  {
    actions: {
      assignHuman: assign((context: TerminatorContext) => {
        const randomIndex = Math.floor(
          Math.random() * context.unassignedHumans.length
        );

        const humanAssigned = context.unassignedHumans[randomIndex];

        const unassignedHumans = context.unassignedHumans.filter(
          (human) => human !== humanAssigned
        );

        return {
          humanAssigned,
          unassignedHumans,
        };
      }),
    },
  }
);
