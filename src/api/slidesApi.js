const API_BASE_URL = 'https://casevault-1.vercel.app/api';

/**
 * GET /api/slides
 * Public — Handles pagination, filtering, searching, and sorting dynamically against the DB.
 */
export async function fetchSlides({
  page = 1,
  limit = 6,
  category = 'All',
  search = '',
  sort = 'latest',
} = {}) {
  const params = new URLSearchParams({
    page,
    limit,
    sort,
    ...(category !== 'All' && { category }),
    ...(search.trim() && { search: search.trim() }),
  });

  const response = await fetch(`${API_BASE_URL}/slides?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch gallery slides');
  }
  return response.json(); 
}

/** * GET /api/slides/:id 
 * Public — Satisfies the exact requirement in Section 4.1 of the PDF.
 */
export async function fetchSlideById(id) {
  const response = await fetch(`${API_BASE_URL}/slides/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Slide resource not found');
  }
  const result = await response.json();
  return result.data;
}

/**
 * POST /api/slides
 * Protected — Formats the frontend data payload to strictly match the Mongoose Schema.
 */
/**
 * POST /api/slides
 * Protected — Formats the frontend data payload to strictly match the Mongoose Schema.
 */
export async function createSlide(payload, token) {
  if (!token) throw new Error('Unauthorized action: missing token');

  // Safely map frontend form fields directly without hardcoded placeholders overwriting them
const backendPayload = {
    title: payload.title,
    description: payload.description || payload.desc || '',
    
    // Pass BOTH format options so the backend validation passes either setup
    tags: Array.isArray(payload.tags) ? payload.tags : [payload.category || 'Strategy'],
    category: payload.category || 'Strategy', 
    
    previewImageUrl: payload.previewImageUrl || payload.image || '', 
    slideUrl: payload.slideUrl || payload.url || '', 
    
    competitionName: payload.competition || payload.competitionName || '', 
    year: Number(payload.year) || 2026,
  };

  const response = await fetch(`${API_BASE_URL}/slides`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(backendPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to post slide deck');
  }
  const result = await response.json();
  return result.data;
}

/** PUT /api/slides/:id */
export async function updateSlide(id, payload, token) {
  if (!token) throw new Error('Unauthorized action: missing token');

  const response = await fetch(`${API_BASE_URL}/slides/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Modification rejected');
  }
  const result = await response.json();
  return result.data;
}

/** DELETE /api/slides/:id */
export async function deleteSlide(id, token) {
  if (!token) throw new Error('Unauthorized action: missing token');

  const response = await fetch(`${API_BASE_URL}/slides/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Deletion rejected');
  }
  return response.json();
}