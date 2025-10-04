# **App Name**: Kathaipom Social

## Core Features:

- Phone OTP Authentication: Secure user authentication using Phone OTP login and secure admin login via email/password with custom claim "admin".
- Admin Post Creation: Admins can create permanent posts with images; only admins have post creation permissions.
- User Engagement: Users can like, comment on, and follow other users, interacting with admin-created posts.
- Data Storage: Utilize Firestore collections (users, posts, likes, reviews, follows) and Storage for image storage, with Cloud Functions for setAdmin(uid) and createPost.
- Media Management: Automatic thumbnail generation powered by Cloud Functions for uploaded images, optimizing storage and performance.
- Optimistic Updates: Implement optimistic updates for likes and follows, providing immediate feedback to users while changes are synced in the background.
- Feed Filtering and Sorting: Generative AI powered tool for feed to intelligently sort and prioritize content based on the specific interests of the user.

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) to evoke a sense of calm and sophistication.
- Background color: Very light desaturated lavender (#F5F5FF) to maintain a clean and airy feel.
- Accent color: Muted blue-violet (#8A2BE2) for interactive elements, providing contrast without overwhelming the pastel theme.
- Body text: 'PT Sans' for a humanist touch; its modern, slightly warm appearance works well for the main body text.
- Headline Font: 'Playfair' for headlines, lends an elegant touch to titles while still being easy to read.
- Simple, outlined icons that complement the pastel color scheme and maintain a clean interface.
- Clean, grid-based layout with ample white space for a professional and premium feel.
- Subtle micro-interactions and transitions to enhance user experience and provide feedback.