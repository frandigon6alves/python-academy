import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { RewardsPanel } from "./RewardsPanel";
import { ScoreSummary } from "./ScoreSummary";

const rewards = {
  xp_gained: 35,
  level: { level: 1, xp: 35, level_start_xp: 0, next_level_xp: 100, percent: 35 },
  leveled_up: false,
  new_badges: [],
  completed_quests: [],
};

describe("ScoreSummary", () => {
  it("encourages after a low score instead of celebrating", () => {
    renderWithProviders(
      <>
        <ScoreSummary correct={0} total={3} />
        <RewardsPanel rewards={rewards} celebrate={false} />
      </>,
    );
    expect(screen.getByText("Keep going!")).toBeInTheDocument();
    expect(screen.getByText(/You scored 0 of 3\. Read the explanations/)).toBeInTheDocument();
    expect(screen.getByText("You still earned +35 XP for practising.")).toBeInTheDocument();
    expect(screen.queryByText("Perfect score!")).not.toBeInTheDocument();
  });

  it("celebrates a perfect score", () => {
    renderWithProviders(
      <>
        <ScoreSummary correct={3} total={3} />
        <RewardsPanel rewards={rewards} />
      </>,
    );
    expect(screen.getByText("Perfect score!")).toBeInTheDocument();
    expect(screen.getByText("+35 XP")).toBeInTheDocument();
  });

  it("speaks Spanish", () => {
    renderWithProviders(<ScoreSummary correct={2} total={3} />, "es");
    expect(screen.getByText("¡Buen trabajo!")).toBeInTheDocument();
    expect(screen.getByText(/Acertaste 2 de 3\./)).toBeInTheDocument();
  });
});
