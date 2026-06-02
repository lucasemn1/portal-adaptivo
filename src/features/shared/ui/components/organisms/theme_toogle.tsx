"use client";

import { useEffect, useState } from "react";
import { Theme } from "../../../../../enums/theme";

export function ThemeToogle() {
  const [theme, setTheme] = useState(Theme.LIGHT);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/immutability
    setTheme(getTheme());
  }, []);

  useEffect(() => {
    localStorage.setItem("@portal-adaptativo/theme", theme);
  }, [theme]);

  function getTheme() {
    return localStorage.getItem("@portal-adaptativo/theme") as Theme;
  }
}
