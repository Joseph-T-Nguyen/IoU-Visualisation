import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import Color from "color";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { defaultColors } from "@/hooks/workspace/stores/useShapesStore.ts";

export interface ColorPickerProps {
  color: string
  setColor?: (color: string) => void
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

  if (!props.setColor) {
    return (
      <Button
        className="w-6 h-6"
        size="icon"
        style={{ background: backgroundColor }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
      />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-6 h-6"
          size="icon"
          style={{ background: backgroundColor }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit p-2">
        <div className="grid grid-cols-5 gap-2">
          {defaultColors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-md border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => props.setColor!(color)}
              title={color}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}