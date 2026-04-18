const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

/** React Native TextInput: caret + selection highlight */
export const loginTextInputCaret = {
  cursorColor: "#fbbf24",
  selectionColor: "rgba(251, 191, 36, 0.4)",
} as const;

export const profileTextInputCaret = {
  cursorColor: "#1a3c34",
  selectionColor: "rgba(26, 60, 52, 0.25)",
} as const;
