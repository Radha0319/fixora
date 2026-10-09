// MATCH: Service Provider search, eligibility verification and ranking engine
import { ServiceProvider } from '../models/ServiceProvider.js';
import { calculateProviderScore, isProviderNew } from '../utils/index.js';

export const searchEligibleProviders = async ({
  deviceCategory,
  expertise,
  city,
  customerLocation
}) => {
  // DB: Query only providers meeting the strict backend eligibility rule
  // Rule #18: faceRegistered === true AND documentsVerified === true AND adminApproved === true AND user.accountStatus === 'active'
  const filter = {
    faceRegistered: true,
    documentsVerified: true,
    adminApproved: true
  };

  if (deviceCategory) {
    filter.categories = deviceCategory;
  }

  const providers = await ServiceProvider.find(filter)
    .populate({
      path: 'user',
      match: { accountStatus: 'active' },
      select: 'name email mobileNumber profileImage accountStatus'
    })
    .lean();

  // Filter out any where user account status is not active (due to populate match)
  const activeEligible = providers.filter((p) => p.user !== null);

  // Score and rank each provider
  const scoredProviders = activeEligible.map((provider) => {
    const categoryMatch = deviceCategory ? provider.categories.includes(deviceCategory) : true;
    
    // Check specific expertise or problem domain match
    let expertiseMatch = false;
    if (expertise && provider.expertise && provider.expertise.length > 0) {
      const expTerm = expertise.toLowerCase();
      expertiseMatch = provider.expertise.some((e) =>
        e.toLowerCase().includes(expTerm) || expTerm.includes(e.toLowerCase())
      );
    }

    // Check location match
    let locationMatch = false;
    const targetCity = city || (customerLocation && customerLocation.city);
    if (targetCity && provider.location && provider.location.city) {
      locationMatch = provider.location.city.toLowerCase() === targetCity.toLowerCase();
      if (!locationMatch && provider.serviceArea && provider.serviceArea.length > 0) {
        locationMatch = provider.serviceArea.some(
          (area) => area.toLowerCase() === targetCity.toLowerCase()
        );
      }
    }

    // Calculate score using formula
    const matchScore = calculateProviderScore({
      categoryMatch,
      expertiseMatch,
      locationMatch,
      isAvailable: provider.isAvailable,
      rating: provider.rating
    });

    const isNew = isProviderNew(provider.approvedAt);

    return {
      _id: provider._id,
      userId: provider.user._id,
      name: provider.user.name,
      email: provider.user.email,
      mobileNumber: provider.user.mobileNumber,
      profileImage: provider.user.profileImage,
      categories: provider.categories,
      expertise: provider.expertise,
      experienceYears: provider.experienceYears,
      location: provider.location,
      serviceArea: provider.serviceArea,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      completedServicesCount: provider.completedServicesCount,
      isAvailable: provider.isAvailable,
      bio: provider.bio,
      approvedAt: provider.approvedAt,
      isNew,
      matchScore,
      matchBreakdown: {
        categoryMatch,
        expertiseMatch,
        locationMatch,
        isAvailable: provider.isAvailable
      }
    };
  });

  // Sort descending by matchScore (Priority 1: Expertise, Priority 2: Nearby/Avail, Priority 3: Rating)
  scoredProviders.sort((a, b) => b.matchScore - a.matchScore);

  return scoredProviders;
};
