/// <reference types="cypress" />
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    cy.mount(<Button>Click me</Button>);
    cy.get('button').should('contain.text', 'Click me');
  });

  it('handles click events', () => {
    const onClick = cy.stub();
    cy.mount(<Button onClick={onClick}>Click me</Button>);
    cy.get('button').click();
    cy.wrap(onClick).should('have.been.called');
  });

  it('applies disabled state correctly', () => {
    cy.mount(<Button disabled>Disabled button</Button>);
    cy.get('button').should('be.disabled');
  });

  it('applies custom className', () => {
    cy.mount(<Button className='custom-class'>Custom button</Button>);
    cy.get('button').should('have.class', 'custom-class');
  });

  it('renders different variants', () => {
    cy.mount(<Button variant='secondary'>Secondary button</Button>);
    cy.get('button').should('contain.text', 'Secondary button');
  });

  it('renders different sizes', () => {
    cy.mount(<Button size='lg'>Large button</Button>);
    cy.get('button').should('contain.text', 'Large button');
  });
});
