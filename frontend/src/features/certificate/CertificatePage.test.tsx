import { screen } from "@testing-library/react";
import { mockFetch, renderWithProviders } from "@/test/render";
import { CertificatePage } from "./CertificatePage";

const certificate = {
  verification_id: "abc123",
  recipient_name: "Ada Lovelace",
  course_slug: "python-basics",
  course_title: "Python Basics",
  score_percent: 83,
  issued_at: "2026-03-01T10:00:00Z",
};

describe("CertificatePage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows the certificate", async () => {
    mockFetch({ "GET /api/v1/certificates/abc123": certificate });
    renderWithProviders(<CertificatePage verificationId="abc123" />);
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Python Basics")).toBeInTheDocument();
    expect(screen.getByText("Issued on March 1, 2026")).toBeInTheDocument();
  });

  it("says when no certificate matches the ID", async () => {
    mockFetch({});
    renderWithProviders(<CertificatePage verificationId="nope" />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No certificate matches this verification ID.",
    );
    expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  });

  it("offers a retry when the lookup fails for another reason", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Bad gateway", { status: 502 })),
    );
    renderWithProviders(<CertificatePage verificationId="abc123" />);
    expect(await screen.findByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.queryByText("No certificate matches this verification ID.")).not.toBeInTheDocument();
  });
});
