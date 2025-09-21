// Navigation component type definitions

export interface NavigationProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}
