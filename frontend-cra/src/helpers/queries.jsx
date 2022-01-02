
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
              width
              height
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
            derivative(style: PRODUCTCATEGORY) {
              url
              width
              height
            }
            alt
            title
            width
            height
            url
          }
        }
      }
    }
  }
`;

/**
 * Create an Order
 * 
 * @code
 *   SsOrderCreateInput {
 *     "title" = "String",
 *     "uid" = "Int!",
 *     "fieldStatus" = "String",
 *     "orderItems" = "[SsOrderItem]"
 *   }
 * @endcode
 */
export const CREATE_ORDER = gql`
  mutation CreateOrder($order:SsOrderCreateInput!) {
    createOrder(input: $order) {
      errors
      violations {
        code
        message
        path
      }
      entity {
        ... on NodeOrder {
          nid
          title
          fieldStatus {
            entity {
              entityLabel
            }
          }
        }
      }
    }
  } 
`;

/**
 * Update an Order
 * 
 * @code
 *   SsOrderUpdateInput {
 *     "title" = "String",
 *     "uid" = "Int!",
 *     "fieldStatus" = "String",
 *     "orderItems" = "[SsOrderItem]"
 *   }
 * @endcode
 * 
 * @code
 *   SsOrderItem {
 *     "productId" = "Int!",
 *     "quantity" = "Float!",
 *   }
 * @endcode
 */
export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: String!, $order:SsOrderUpdateInput!) {
    updateOrder(input: $order, id: $id) {
      errors
      violations {
        code
        message
        path
      }
      entity {
        ... on NodeOrder {
          nid
          title
          fieldTotalOrderAmount
          fieldStatus {
            entity {
              entityLabel
            }
          }
          fieldOrderItems {
            entity {
              ... on ParagraphProductItem {
                fieldProduct {
                  entity {
                    ... on NodeProduct {
                      title
                      fieldQuantity
                    }
                  }
                }
                fieldQuantity
              }
            }
          }
        }
      }
    }
  }
`