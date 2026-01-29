
# Move LinkedIn Share Button Position

## Problem
The floating LinkedIn "Connect" button and the new Chat widget are both positioned at `fixed bottom-6 right-6`, causing them to overlap on the homepage.

## Solution
Adjust the FloatingSocial component to position the LinkedIn button above the chat button, maintaining the right-side alignment.

## Changes

### File: `src/components/FloatingSocial.tsx`
- Change `bottom-6` to `bottom-24` to position the LinkedIn button above the chat widget
- This places it approximately 96px from the bottom (24 x 4px = 96px), giving space for the chat button which sits at 24px from the bottom

This simple positioning change will stack the LinkedIn button above the chat button on the right side of the screen.
