interface Navigation {
  navigate: (screen: string, params?: object) => void;
  goBack: () => void;
}

export default Navigation;
