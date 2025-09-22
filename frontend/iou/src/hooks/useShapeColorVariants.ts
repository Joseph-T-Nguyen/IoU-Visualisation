import {useMemo} from "react";
import Color from "colorjs.io";


/**
 * Rotates the hue of a function towards blue
 * @param col the color to get a rotated version of
 * @param step the number of degrees to move towards blue by
 */
function rotateTowardsBlue(col: string | Color, step: number) {
  const c = new Color(col).to("oklch");

  const h = c.h;
  c.h = c.h + (h < 80 ? -step : h > 260 ? -step : step);
  return new Color(c);
}

// function rotateOk(col: Color, step: number) {
//   const c = new Color(col).to("oklch");
//   c.h += step;
//   return new Color(c);
// }
//
// function lerpOk(a: Color, b: Color, t: number) {
//   const c = new Color(a).to("oklab");
//   const aOk = a.to("oklab");
//   const bOk = b.to("oklab");
//
//   c.l = (1-t)*aOk.l + t*bOk.l;
//   c.a = (1-t)*aOk.a + t*bOk.a;
//   c.b = (1-t)*aOk.b + t*bOk.b;
//
//   return new Color(c);
// }

function lighten(c: Color, amount = 0.1) {
  const hsl = c.to("hsl");
  hsl.l += amount * (255 - hsl.l)
  return new Color(hsl);
}

function lightenOk(c: Color, amount = 0.1) {
  const hsl = c.to("oklab");
  hsl.l += amount * (1 - hsl.l)
  return new Color(hsl);
}

function darkenOk(c: Color, amount = 0.1) {
  const hsv = c.to("oklab");
  hsv.l -= amount * (hsv.l)
  return new Color(hsv);
}

function saturate(c: Color, amount = 0.2) {
  const hsl = c.to("oklch");
  hsl.c += amount * (0.4 - hsl.c)
  return new Color(hsl);
}

function desaturate(c: Color, factor = 0.8) {
  const oklch = c.to("oklch");
  return new Color("oklch", [oklch.coords[0], oklch.coords[1] * factor, oklch.coords[2]]);
}

function hex(c: Color) {
  return c.to("srgb").toString({format: "hex"});
}

const selectionColor = "#00D3F2";
const hoverFresnelColor = hex(lighten(new Color(selectionColor), 0.23));

export default function useShapeColorVariants(shapeColor: string, wholeShapeIsSelected: boolean = false) {

  const color = useMemo(() => {
    if (!wholeShapeIsSelected)
      return shapeColor;
    return shapeColor;

  }, [wholeShapeIsSelected, shapeColor])

  const baseColor = useMemo<string>(() => (
    hex(lightenOk(new Color(color), 0.45))
  ), [color]);

  const secondaryBaseColor = useMemo<string>(() => {
    const col = new Color(baseColor);
    col.to("hsv");

    const step = 10; //< How much to rotate the secondary hue towards 230 degrees by
    // return hex(rotateTowardsBlue(darken(saturate(col, 0.025), 0.20), step))
    return hex(rotateTowardsBlue(darkenOk(saturate(col, 0.25), 0.10), step))
  }, [baseColor])

  const hoverColor = useMemo<string>(() => {
    return hex(rotateTowardsBlue(baseColor, 2.5))
  }, [baseColor]);

  const secondaryHoverColor = useMemo<string>(() => {
    const col = new Color(baseColor);
    return hex(rotateTowardsBlue(darkenOk(saturate(col, 0.03), 0.10), 20))
  }, [baseColor]);

  const selectedEdgeColor = useMemo<string>(() => {
    const col = new Color(color);
    const funnyCol = rotateTowardsBlue(lightenOk(desaturate(col, 0.95), 0.05), 2);


    // return hex(lerpOk(funnyCol, new Color(selectionColor), 0.8));
    return hex(funnyCol);
  }, [color]);

  return {
    color,
    baseColor,
    secondaryBaseColor,
    hoverColor,
    secondaryHoverColor,
    hoverFresnelColor,
    selectedEdgeColor
  }
}








