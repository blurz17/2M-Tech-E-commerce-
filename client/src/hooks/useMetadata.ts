// src/hooks/useMetadata.ts
import { useEffect } from 'react';
import { useConstants } from './useConstants';

export const useMetadata = () => {
    const { constants, isLoading } = useConstants();

    useEffect(() => {
        if (!isLoading && constants) {
            // Update document title
            document.title = constants.metaTitle;

            // Update meta description
            const descriptionMeta = document.querySelector('meta[name="description"]');
            if (descriptionMeta) {
                descriptionMeta.setAttribute('content', constants.metaDescription);
            }

            // Update meta keywords
            const keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (keywordsMeta) {
                keywordsMeta.setAttribute('content', constants.metaKeywords);
            }

            // Update Open Graph data
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                ogTitle.setAttribute('content', constants.metaTitle);
            }

            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
                ogDescription.setAttribute('content', constants.metaDescription);
            }

            // Update Twitter Card data
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) {
                twitterTitle.setAttribute('content', constants.metaTitle);
            }

            const twitterDescription = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescription) {
                twitterDescription.setAttribute('content', constants.metaDescription);
            }

            // Update structured data
            updateStructuredData(constants);
        }
    }, [constants, isLoading]);

    return { constants, isLoading };
};

const updateStructuredData = (constants: any) => {
    const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (structuredDataScript) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": constants.companyName,
            "alternateName": constants.companyName,
            "url": constants.website ,
            "logo": constants.logo,
            "description": constants.description || constants.metaDescription,
            "address": {
                "@type": "PostalAddress",
                "addressCountry": ""
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": constants.phone,
                "email": constants.email,
                "contactType": "Customer Service"
            },
            "sameAs": [
                constants.facebook,
                constants.instagram,
                constants.twitter,
                constants.linkedin
            ].filter(Boolean)
        };
        
        structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
    }
};