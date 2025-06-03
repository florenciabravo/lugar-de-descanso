package com.lugardedescanso.dto;

import com.lugardedescanso.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoleRequest {

    private Role role;
}
