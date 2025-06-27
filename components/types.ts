import { Mesh } from "three";

export type WheelParts = {
  FrontHub?: Mesh;
  FrontSpokes?: Mesh;
  FrontRim?: Mesh;
  FrontNipples?: Mesh;

  RearHub?: Mesh;
  RearSpokes?: Mesh;
  RearRim?: Mesh;
  RearNipples?: Mesh;
};
