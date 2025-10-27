import { Button } from '@/components/atoms/Button/Button';

describe('Button Component', () => {
  it('should render with text', () => {
    cy.mount(<Button>Test Button</Button>);
    cy.contains('Test Button').should('be.visible');
  });

  it('should handle click events', () => {
    const onClick = cy.stub();
    cy.mount(<Button onClick={onClick}>Click Me</Button>);
    cy.contains('Click Me').click();
    cy.wrap(onClick).should('have.been.called');
  });
});
