import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { User } from 'lucide-react';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://invalid-url.png" alt="Avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithIconFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://another-invalid-url.png" alt="Avatar" />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  ),
};
