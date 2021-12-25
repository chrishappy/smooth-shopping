
import { gql } from "@apollo/client";

/**
 * Get the current user's information, e.g. how much credit left for this month
 */
export const GET_USER_STATS = gql`
query getUserStats {
  currentUserContext {
    uid,
    familyName: fieldSsFamilyName,
    creditsRemaining: fieldSsCurrentCredit,
    totalCredits: fieldSsMonthlyCredit,
    numberOfFamilyMembers: fieldSsPersonCount,
  }
}
`
// Get the images of the main product categories
export const GET_PRODUCT_CATEGORIES = gql`
  query GetCategories {
    taxonomyTermQuery(filter: {
    conditions: [
      {operator: EQUAL, field: "vid", value: ["product_categories"]},
    ]}) {
      count
      entities {
        entityId
        entityUuid
        entityLabel
        entityType
        entityUrl {
          path
        }
        ... on TaxonomyTermProductCategories {
          fieldImage {
            derivative(style: PRODUCTCATEGORY) {
              url
            }
            alt
            title
          }
        }
      }
    }
  }
`;

/**
 * Get the products of a category
 * 
 * @param $category the name of the product category
 */ 
export const GET_PRODUCTS_OF_CATEGORY = gql`
  # Get the products in a category
  query GetCategoryProducts($category:String) {
    nodeQuery(filter: {
      conditions: [
        {operator: EQUAL, field: "type", value: ["product"]},
        {operator: EQUAL, field: "field_categories.entity.name", value: [$category]},
      ]}
    ) {
      entities {
        entityUuid
        entityId
        entityLabel
        ... on NodeProduct {
          fieldCategories {
            targetId
            entity {
              name
              entityLabel
            }
          }
          fieldCredit
          fieldExpired
          fieldImage {
            entity {
              ... on File {
                url
              }
            }
          }
        }
      }
    }
  }
`;