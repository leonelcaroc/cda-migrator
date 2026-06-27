export function queryCoop(id: string) {
  const getAllCoops = `SELECT
  rc.*,

  c.id                    AS mysql_coop_id,
  c.users_id              AS mysql_users_id,
  c.type_of_cooperative   AS c_coop_type,
  c.field_of_membership   AS c_field_of_membership,

  u.id                   AS user_id,
  u.email                AS user_email,
  u.first_name           AS user_first_name,
  u.last_name            AS user_last_name,
  u.middle_name          AS user_middle_name,
  u.birthdate            AS user_birthdate,
  u.contact_number       AS user_contact_number,
  u.address              AS user_address,

  ca.id                  AS ca_user_id,
  ca.fullname            AS ca_user_fullname,
  ca.position            AS ca_user_position,
  ca.idType              AS ca_user_idType,
  ca.idNo                AS ca_user_idNo,
  ca.email               AS ca_user_email,
  ca.mobileNo            AS ca_user_mobileNo,

  cap.id                 AS capitalization_id,
  cap.regular_members,
  cap.associate_members,
  cap.authorized_share_capital,
  cap.par_value,
  cap.common_share,
  cap.preferred_share,
  cap.total_amount_of_subscribed_capital,
  cap.total_no_of_subscribed_capital,
  cap.total_amount_of_paid_up_capital,
  cap.total_no_of_paid_up_capital,
  cap.minimum_subscribed_share_regular,
  cap.minimum_paid_up_share_regular,
  cap.minimum_subscribed_share_associate,
  cap.minimum_paid_up_share_associate,
  cap.amount_of_common_share_subscribed,
  cap.amount_of_common_share_subscribed_pervalue,
  cap.amount_of_preferred_share_subscribed,
  cap.amount_of_preferred_share_subscribed_pervalue,
  cap.amount_of_common_share_paidup,
  cap.amount_of_common_share_paidup_pervalue,
  cap.amount_of_preferred_share_paidup,
  cap.amount_of_preferred_share_paidup_pervalue,

  d.cooperators                       AS cooperators,

  e.branches                          AS branches,

  
 

  aoc.id                            AS aoc_yearsOfExistence,
  aoc.directors_turnover_days       AS aoc_directorsTurnoverDays,
  aoc.directors_turnover_days       AS aoc_directorsTurnoverDays,

  ra.id                    AS ra_id,
  ra.cooperative_id        AS ra_cooperative_id,
  ra.amendment_no          AS ra_amendment_no,
  ra.coopName              AS ra_coopName,
  ra.acronym               AS ra_acronym,
  ra.regNo                 AS ra_regNo,
  ra.type                  AS ra_type,
  ra.category              AS ra_category,
  ra.dateRegistered        AS ra_dateRegistered,
  ra.commonBond            AS ra_commonBond,
  ra.areaOfOperation       AS ra_areaOfOperation,
  ra.noStreet              AS ra_noStreet,
  ra.Street                AS ra_Street,
  ra.addrCode              AS ra_addrCode,
  ra.interregional         AS ra_interregional,
  ra.compliant             AS ra_compliant,

  ra.amendment_count       AS ra_total_amendments,

  am.id                                         AS am_id,
  am.category_of_cooperative                    AS am_category,
  am.type_of_cooperative                        AS am_type,
  am.grouping                                   AS am_grouping,
  am.proposed_name                              AS am_proposedName,
  am.acronym_name                               AS am_acronymName,
  am.common_bond_of_membership                  AS am_commonBond,
  am.field_of_membership                        AS am_fieldOfMembership,
  am.name_of_ins_assoc                          AS am_nameOfInsAssoc,
  am.area_of_operation                          AS am_areaOfOperation,
  am.refbrgy_brgyCode                           AS am_refBrgyCode,
  am.interregional                              AS am_interregional,
  am.regions                                    AS am_regions,
  am.street                                     AS am_street,

  am_cap.authorized_share_capital                     AS amcap_authorizedShareCapital,
  am_cap.total_amount_of_subscribed_capital           AS amcap_totalAmountOfSubscribedCapital,
  am_cap.total_amount_of_paid_up_capital              AS amcap_totalAmountOfPaidUpCapital



FROM (
    SELECT rc.*
    FROM registeredcoop rc
    INNER JOIN (
        SELECT regNo, MIN(id) AS min_id
        FROM registeredcoop
        GROUP BY regNo
    ) t ON rc.regNo = t.regNo AND rc.id = t.min_id
) rc



LEFT JOIN cooperatives c
  ON rc.application_id = c.id
LEFT JOIN users u
  ON c.users_id = u.id

LEFT JOIN (
    SELECT ca1.*
    FROM ca_user ca1
    INNER JOIN (
        SELECT regNo, MAX(dateCreated) AS latestDate
        FROM ca_user
        WHERE is_verified = '1'
        GROUP BY regNo
    ) ca_max
    ON ca1.regNo = ca_max.regNo
    AND ca1.dateCreated = ca_max.latestDate
    WHERE ca1.is_verified = '1' 
     AND ca1.status <> 'Denied'
) ca
ON rc.regNo = ca.regNo
LEFT JOIN capitalization cap
  ON rc.application_id = cap.cooperatives_id
LEFT JOIN (
  SELECT
    cooperatives_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', id,
        'full_name', full_name,
        'gender', gender,
        'birth_date', birth_date,
        'house_blk_no', house_blk_no,
        'streetName', streetName,
        'addrCode', addrCode,
        'position', position,
        'type_of_member', type_of_member,
        'number_of_subscribed_shares', number_of_subscribed_shares,
        'number_of_paid_up_shares', number_of_paid_up_shares,
        'proof_of_identity', proof_of_identity,
        'proof_date_issued', proof_date_issued,
        'place_of_issuance', place_of_issuance
      )
    ) AS cooperators
  FROM cooperators
  GROUP BY cooperatives_id
) d ON rc.application_id = d.cooperatives_id
LEFT JOIN (
  SELECT
    regNo,
    COALESCE(
      JSON_ARRAYAGG(
        JSON_OBJECT(
        'id', id,
        'branchName', branchName)
      ),
      JSON_ARRAY()
    ) AS branches
  FROM branches
  GROUP BY regNo
) e ON rc.regNo = e.regNo





LEFT JOIN articles_of_cooperation aoc
  ON rc.application_id = aoc.cooperatives_id
LEFT JOIN bylaws bl
  ON rc.application_id = bl.cooperatives_id



LEFT JOIN (
  SELECT 
    ra1.*,
    ra_max.amendment_count   
  FROM registeredamendment ra1
  INNER JOIN (
    SELECT regNo, MAX(id) AS max_id, COUNT(*) AS amendment_count
    FROM registeredamendment
    GROUP BY regNo
  ) ra_max
  ON ra1.regNo = ra_max.regNo
  AND ra1.id = ra_max.max_id
) ra
ON rc.regNo = ra.regNo

LEFT JOIN cooperatives am
  ON ra.cooperative_id = am.id
LEFT JOIN capitalization am_cap
  ON ra.cooperative_id = am_cap.cooperatives_id


WHERE rc.id = ${id}

`;

  // LIMIT 10

  return getAllCoops;
}
