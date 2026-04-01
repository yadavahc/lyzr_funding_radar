import ParticleWaves from "@/components/ParticleWaves";
import Header from "@/components/Header";
import AetherFlowBackground from "@/components/ui/aether-flow-background";

export default function Visualizer() {
  return (
    <AetherFlowBackground>
      <Header />
      <ParticleWaves />
    </AetherFlowBackground>
  );
}
