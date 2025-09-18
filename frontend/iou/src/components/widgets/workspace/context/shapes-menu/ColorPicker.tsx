import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import Color from "color";

export interface ColorPickerProps {
  color: string,
  setColor?: (color: string) => void,

  onClick?: () => void,
}

export default function ColorPicker(props: ColorPickerProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const backgroundColor = pressed
    ? Color(props.color).darken(0.1).hex()  // slightly darker
    : hovered || focused
      ? Color(props.color).lighten(0.1).hex() // slightly lighter
      : props.color

  return (
    <Button
      className="w-6 h-6"
      size="icon"
      style={{ background: backgroundColor }}
      onClick={props.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    />
  )
}