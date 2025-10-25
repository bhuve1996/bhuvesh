# Google AdSense Setup Guide

This guide explains how to set up Google AdSense for monetizing your portfolio website with display ads.

## Overview

Google AdSense allows you to earn money by displaying ads from other advertisers on your website. This implementation includes:

- ✅ **AdSense Integration**: Complete AdSense setup with proper ad units
- ✅ **Strategic Ad Placement**: Ads placed in high-traffic areas
- ✅ **Responsive Design**: Ads that work on all devices
- ✅ **Performance Tracking**: Analytics integration for ad performance
- ✅ **Ad Blocker Detection**: Graceful handling of ad blockers
- ✅ **Development Mode**: Safe testing without affecting live ads

## Prerequisites

### 1. Google AdSense Account

- Apply for Google AdSense at [adsense.google.com](https://adsense.google.com)
- Get approved (this can take 1-14 days)
- Obtain your Publisher ID (format: `ca-pub-XXXXXXXXXX`)

### 2. Website Requirements

- ✅ Your website must have original, valuable content
- ✅ Must comply with AdSense policies
- ✅ Should have good traffic (minimum 1000+ monthly visitors recommended)
- ✅ Must have a privacy policy and terms of service

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Google AdSense Configuration
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXX

# Ad Slot IDs (get these from your AdSense account)
NEXT_PUBLIC_ADSENSE_HEADER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_FOOTER_SLOT=1234567893
NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT=1234567894
NEXT_PUBLIC_ADSENSE_MOBILE_SLOT=1234567895
```

**Important Notes:**

- Replace `ca-pub-XXXXXXXXXX` with your actual AdSense Publisher ID
- Replace the slot IDs with your actual ad unit IDs from AdSense
- Only works in production environment by default

### 2. Create Ad Units in AdSense

In your AdSense account, create these ad units:

#### Header Ad Unit

- **Name**: Header Banner
- **Size**: 728x90 (Leaderboard)
- **Type**: Display
- **Placement**: Top of page

#### Sidebar Ad Unit

- **Name**: Sidebar Rectangle
- **Size**: 300x250 (Medium Rectangle)
- **Type**: Display
- **Placement**: Sidebar

#### In-Content Ad Unit

- **Name**: In-Content Rectangle
- **Size**: 336x280 (Large Rectangle)
- **Type**: Display
- **Placement**: Within content

#### Footer Ad Unit

- **Name**: Footer Banner
- **Size**: 728x90 (Leaderboard)
- **Type**: Display
- **Placement**: Bottom of page

#### Responsive Ad Unit

- **Name**: Responsive Ad
- **Size**: Responsive
- **Type**: Display
- **Placement**: Various locations

#### Mobile Ad Unit

- **Name**: Mobile Banner
- **Size**: 320x50 (Mobile Banner)
- **Type**: Display
- **Placement**: Mobile devices

### 3. Ad Placement Strategy

The implementation includes ads in these strategic locations:

#### Blog Page (`/blog`)

- **In-content ads**: Between blog posts
- **Responsive ads**: Throughout the content
- **High engagement**: Users reading content are more likely to click

#### Projects Page (`/projects`)

- **Project showcase ads**: Between project cards
- **Responsive placement**: Adapts to different screen sizes

#### Services Page (`/services`)

- **Service listing ads**: Between service cards
- **Strategic placement**: After service overview, before details

#### Homepage (`/`)

- **Header ads**: Top of page (optional)
- **Content ads**: Between sections (optional)

### 4. Ad Components Usage

#### Basic Ad Component

```tsx
import { AdSense } from '@/components/ads';

function MyComponent() {
  return <AdSense adSlot='1234567890' adFormat='auto' responsive={true} />;
}
```

#### Predefined Ad Components

```tsx
import {
  HeaderAd,
  SidebarAd,
  InContentAd,
  FooterAd,
  ResponsiveAd,
} from '@/components/ads';

function MyPage() {
  return (
    <div>
      <HeaderAd />
      <main>
        <InContentAd />
        {/* Your content */}
        <ResponsiveAd />
      </main>
      <FooterAd />
    </div>
  );
}
```

#### Ad Placement Wrappers

```tsx
import { BlogAdPlacement, ProjectAdPlacement } from '@/components/ads';

function BlogPost() {
  return (
    <BlogAdPlacement>
      <article>{/* Your blog content */}</article>
    </BlogAdPlacement>
  );
}
```

### 5. AdSense Hook Usage

```tsx
import { useAdSense } from '@/hooks/useAdSense';

function MyComponent() {
  const { isEnabled, canShowAd, trackAdClick, isAdBlocked } = useAdSense();

  const handleAdClick = () => {
    trackAdClick('1234567890', 'header');
  };

  if (!isEnabled || isAdBlocked) {
    return <div>Ad not available</div>;
  }

  return <div onClick={handleAdClick}>{/* Your ad component */}</div>;
}
```

## Ad Placement Best Practices

### 1. Above the Fold

- Place ads where users see them immediately
- Header ads work well for desktop
- Mobile banner ads for mobile devices

### 2. Within Content

- Place ads between content sections
- Don't interrupt reading flow
- Use responsive ads for better performance

### 3. Sidebar Placement

- Good for desktop users
- Don't use on mobile (takes too much space)
- Use medium rectangle (300x250) size

### 4. Footer Placement

- Good for users who scroll to bottom
- Use leaderboard (728x90) size
- Less intrusive than header ads

## Performance Optimization

### 1. Lazy Loading

Ads are automatically lazy-loaded to improve page performance.

### 2. Ad Blocker Detection

The system detects ad blockers and handles them gracefully.

### 3. Responsive Design

All ads are responsive and work on all device sizes.

### 4. Performance Tracking

Ad clicks and impressions are tracked in Google Analytics.

## Testing

### 1. Development Testing

- Ads show as placeholders in development
- No real ads are served in development mode
- Console logs show ad placement information

### 2. Production Testing

- Use AdSense preview tool
- Test on different devices and browsers
- Verify ads are loading correctly

### 3. AdSense Policy Compliance

- Ensure all ads comply with AdSense policies
- Don't click your own ads
- Monitor for policy violations

## Troubleshooting

### Common Issues

#### 1. Ads Not Showing

- **Check**: Publisher ID is correct
- **Check**: Ad units are approved in AdSense
- **Check**: Website is approved for AdSense
- **Check**: No ad blockers are active

#### 2. Low Revenue

- **Optimize**: Ad placement and sizes
- **Improve**: Website traffic and engagement
- **Test**: Different ad formats and positions
- **Monitor**: Ad performance in AdSense dashboard

#### 3. Policy Violations

- **Review**: AdSense policies regularly
- **Remove**: Any content that violates policies
- **Contact**: AdSense support for clarification

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

This will show detailed ad information in the browser console.

## Revenue Optimization Tips

### 1. Content Quality

- Create valuable, original content
- Update content regularly
- Use relevant keywords

### 2. Traffic Growth

- SEO optimization
- Social media promotion
- Content marketing

### 3. Ad Placement

- Test different ad positions
- Use heat maps to find best spots
- Balance user experience with revenue

### 4. Ad Types

- Test different ad sizes
- Use responsive ads
- Consider native ads

## Legal Considerations

### 1. Privacy Policy

- Update privacy policy to mention ads
- Include AdSense in cookie policy
- Comply with GDPR/CCPA if applicable

### 2. Terms of Service

- Update terms to mention advertising
- Include AdSense terms compliance

### 3. Disclosures

- Consider adding "Ad" labels
- Be transparent about advertising

## Support

For AdSense issues:

1. Check AdSense Help Center
2. Contact AdSense support
3. Review AdSense policies
4. Check website compliance

For implementation issues:

1. Check browser console for errors
2. Verify environment variables
3. Test in different browsers
4. Check network requests

## Expected Revenue

Revenue depends on several factors:

- **Traffic**: More visitors = more ad impressions
- **Geography**: US/UK traffic pays more than other regions
- **Content**: Tech/business content typically pays well
- **Ad Placement**: Above-the-fold ads perform better

Typical ranges:

- **Low traffic** (1K-10K monthly): $10-100/month
- **Medium traffic** (10K-100K monthly): $100-1000/month
- **High traffic** (100K+ monthly): $1000+/month

Remember: Revenue varies greatly and these are rough estimates.
